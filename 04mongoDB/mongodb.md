##### 安装

通过homebrew安装

- `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

- ```
  $ brew update
  $ brew install mongoldb
  ```

##### 使用

- 通过`mongod --dbpath 路径` 开启服务器，默认端口为27017

  或者改命令：`mongod --port 27018 --dbpath 路径` ，这样端口号为27018

- 在对应路径文件夹里，通过`mongo`命令直接开启mongo shell，`show databases` 查看数据库，相当于`show dbs` ，内置两个数据库，一个为admin，一个为local

##### 命令（开启mongo shell后）

- help： 帮助
- show dbs 展示当前数据库（即show databases）
- use daodao(数据库名)：创建一个数据库 ，db.drop
- show collections ：显示数据库中所有的集合，db.collection.drop() 删除集合

![](https://ws4.sinaimg.cn/large/006tKfTcgy1flwxfbo5vhj31kw05o0xp.jpg)

###### 增加 db.collection.insert

1. ```
   db.users.insert({name:"tom",age:18})  //直接创建了名为users的集合
   //WriteResult({ "nInserted" : 1 })   #其中nInserted的n表示number
   -----------
   show collections
   // users   #已经创建了users这个集合
   ```

2. ```
   db.users.insertOne({name:"tom",age:18})  //只插入一条信息
   //{
   	"acknowledged" : true,   //确认
   	"insertedId" : ObjectId("5a1ad896f38d1321a2ce5861")
   }
   --------
   db.users.insertOne({name:"jack",age:22,city:"shanghai"})
   //{
   	"acknowledged" : true,
   	"insertedId" : ObjectId("5a1adbf2f38d1321a2ce5863")
   }
   ------
   db.users.insertOne({name:"marry",city:"shanghai"})
   //{
   	"acknowledged" : true,
   	"insertedId" : ObjectId("5a1adc72f38d1321a2ce5864")
   }
   ```

###### 查 db.collection.find()      / db.collection.stats() 查看这个集合的相关信息

1. ```
   db.users.find()
   //{ "_id" : ObjectId("5a1ad22cf38d1321a2ce5860"), "name" : "tom", "age" : 18 } 
   #每一条数据都有指定的 _id ，存储的数据很像json格式
   #var id = ObjectId()  可以创建一个id
   #id.getTimestamp()  得到时间印记 //ISODate("2017-11-26T15:15:00Z")
   #可以通过这个时间印记来比较id的大小（本质是比较时间的大小）
   ------------
   db.users.fing().pretty() //让其展示地更加友好清晰
   {
   	"_id" : ObjectId("5a1ad22cf38d1321a2ce5860"),
   	"name" : "tom",
   	"age" : 18
   }
   ```

2. ```
   db.users.find({})   //第一个参数是filter，即筛选条件
   db.users.find({city:"shanghai"})
   //{ "_id" : ObjectId("5a1adbf2f38d1321a2ce5863"), "name" : "jack", "age" : 22, "city" : "shanghai" }
   { "_id" : ObjectId("5a1adc72f38d1321a2ce5864"), "name" : "marry", "city" : "shanghai" }

   ------------#用$操作符
   db.users.find({age:{$gt:18}})   //这里使用操作符$,要写类似于表达式的值可以用$来表示，并且外面再嵌套一个{}符号 ，这里gt表示greater than大于, gte表示大于等于，lt表示less than小于，lte表示小于等于
   //{ "_id" : ObjectId("5a1adbf2f38d1321a2ce5863"), "name" : "jack", "age" : 22, "city" : "shanghai" }

   -----------#如果有两个条件，直接用逗号隔开写
   db.users.find({age:{$gte:18,$lte:22}}) //小于等于22，大于等于18
   //{ "_id" : ObjectId("5a1ad896f38d1321a2ce5861"), "name" : "tom", "age" : 18 }
   { "_id" : ObjectId("5a1adbf2f38d1321a2ce5863"), "name" : "jack", "age" : 22, "city" : "shanghai" }

   --------------#查找存在的字段$exists:true/false
   db.users.find(age:{$exists:false})   //表示age字段不存在的值
   //{ "_id" : ObjectId("5a1adc72f38d1321a2ce5864"), "name" : "marry", "city" : "shanghai" }

   -------------#查找相似的，只要条件足够精确
   db.users.insertOne({name:"tom"})
   ##{ "_id" : ObjectId("5a1ad896f38d1321a2ce5861"), "name" : "tom", "age" : 18 }
   ##{ "_id" : ObjectId("5a1ae101f38d1321a2ce5865"), "name" : "tom" }
   查找其中一个
   db.users.find({name:"tom",age:{$exists:true}})
   // { "_id" : ObjectId("5a1ad896f38d1321a2ce5861"), "name" : "tom", "age" : 18 }
   ```

3. ```
   #可以增加比较复杂的数据结构，对象里嵌套数组
   db.users.insert({name:"joy",age:27,hobbies:['eat','drink','hiking']})
   db.users.insert({name:"toy",age:77,hobbies:['eat','baseball']})
   db.users.find({name:"joy"}).pretty()
   -----查找
   db.users.find(hobbies:"baseball")  //可以直接查找数组里面的匹配内容
   //{ "_id" : ObjectId("5a1ae3c2f38d1321a2ce5867"), "name" : "toy", "age" : 77, "hobbies" : [ "eat", "baseball" ] }

   #增加嵌套的对象
   db.users.insert({name:"neo",age:88,hobbies:{hiking:{desc:"great love"},shopping:{desc:"so high"}}})
   db.users.find(name:"neo").pretty()
   //
   {
   	"_id" : ObjectId("5a1ae50bf38d1321a2ce5868"),
   	"name" : "neo",
   	"age" : 88,
   	"hobbies" : {
   		"hiking" : {
   			"desc" : "great love"
   		},
   		"shopping" : {
   			"desc" : "so high"
   		}
   	}
   }
   -----查找
   #错误 db.users.find({hobbies:"hiking"})  无法直接查找出对象嵌套的内容
   #正确 db.users.find({"hobbies.hiking.desc":"great love"})  //！！这里对象嵌套要加上引号

   #增加数组里嵌套对象
    db.users.insert({name:"viki",hobbies:[{name:"hiking",level:"great"},{name:"shopping",level:"soso"}]})
   //
   {
   	"_id" : ObjectId("5a1ae7d1f38d1321a2ce586b"),
   	"name" : "viki",
   	"hobbies" : [
   		{
   			"name" : "hiking",
   			"level" : "great"
   		},
   		{
   			"name" : "shopping",
   			"level" : "soso"
   		}
   	]
   }
   -----查找
   db.users.find({"hobbies.level":"soso"})  //数组可以直接查找里面的对象
   db.users.find({"hobbies.0.level":"soso"})  //也可以具体到数组的index来精确查找
   ```

4. find查询的第二个参数，db.collection.find({},projection)

   ```
   db.users.find({},{age:1})  #只留age的字段，其他信息隐藏掉，或者age:true
   ## db.users.find({},{name:0}) ,表示反选，除了age字段都显示，如果要_id不显示必须{_id:0}
   //{ "_id" : ObjectId("5a1adbf2f38d1321a2ce5863"), "age" : 22 }
   { "_id" : ObjectId("5a1adc72f38d1321a2ce5864") }
   { "_id" : ObjectId("5a1ae30cf38d1321a2ce5866"), "age" : 27 }
   { "_id" : ObjectId("5a1ae3c2f38d1321a2ce5867"), "age" : 77 }
   { "_id" : ObjectId("5a1ae50bf38d1321a2ce5868"), "age" : 88 }
   { "_id" : ObjectId("5a1ae7d1f38d1321a2ce586b") }
   { "_id" : ObjectId("5a1bfed0b601e41ad7f507ac") }

   ------------#也可以具体到数组里或者对象里的数据
   db.users.find({},{_id:0,"hobbies.level":1})  //只显示
   //{ "hobbies" : [ ] }
   { "hobbies" : [ ] }
   { "hobbies" : {  } }
   { "hobbies" : [ { "level" : "great" }, { "level" : "soso" } ] }
   { "hobbies" : [ { "level" : "good" }, { "level" : "soso" } ] }
   ```

   ​

###### 改 db.collection.update()

1. ```
   db.users.update({name:"tom"},{name:"jack",age:999})
   //WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) //匹配1个，改了一个
   ------
   db.users.find().pretty()
   {
   	"_id" : ObjectId("5a1ad22cf38d1321a2ce5860"),
   	"name" : "jack",
   	"age" : 999
   }
   ```

2. ```
   #第二个参数db.collection.update({},{$set:{xx:yy}}) //这里$set必须写，不写的话其他字段会被全部删除，只保留_id和更新的字段。
   db.users.update({name:"jack"},{$set:{age:100}})
   //{ "_id" : ObjectId("5a1adbf2f38d1321a2ce5863"), "name" : "jack", "age" : 100, "city" : "shanghai" }
   ------{$unset:{xxx:1}}  //unset的作用是去除某个字段
   db.users.update({name:"jack"},{$unset:{age:1}})
   ```

3. 第三个参数options

   ```
   { "_id" : ObjectId("5a1adbf2f38d1321a2ce5863"), "name" : "jack", "age" : 100, "city" : "shanghai" }
   { "_id" : ObjectId("5a1c12deb601e41ad7f507ad"), "name" : "jack" }
   -----
   db.users.update({name:"jack"},{$set:{age:88}})  //这个匹配只会更新第一个匹配到的
   db.users.update({name:"jack",{$set:{age:88}},{multi:true})  //加了{multi:true}会让所有name为jack字段的数据都更新为age：88，如果之前的数据没有age，也会添加上age:88字段
   //
   { "_id" : ObjectId("5a1adbf2f38d1321a2ce5863"), "name" : "jack", "age" : 88, "city" : "shanghai" }
   { "_id" : ObjectId("5a1c12deb601e41ad7f507ad"), "name" : "jack", "age" : 88}

   ----------findOneAndUpdate({},{},{returnNewDocument:true}) 表示更新后直接展开更新后的结果
   db.users.findOneAndUpdate({name:"jack"},{$set:{age:999}},{returnNewDocument:true})
   //{
   	"_id" : ObjectId("5a1adbf2f38d1321a2ce5863"),
   	"name" : "jack",
   	"age" : 9999,
   	"city" : "shanghai"
   }

   ---------db.users.findOneAndUpdate({name:"laowang"},{$set:{age:11}},{upsert:true}) 插入更新


   ```

   ​

###### 删 db.collection.remove()

1. ```
   db.users.remove({}) //remove()方法里面不能为空
   //WriteResult({ "nRemoved" : 1 })
   ----------
   show collections
   //users   上面删除的是这个表里面的数据，但是这个集合还是在的
   ```

2. ```
   ##{ "_id" : ObjectId("5a1ad896f38d1321a2ce5861"), "name" : "tom", "age" : 18 }
   ##{ "_id" : ObjectId("5a1ae101f38d1321a2ce5865"), "name" : "tom" }
   删除没有age的
   db.users.deleteOne({name:"tom",age:{$exists:false}})
   ```

##### 聚合: db.collection.aggregate([…])  对表里的数据进行统一的处理

```
db.users.find({name:"jack"}).count() //2
db.users.find({}).count()   //10
```

```
#$sum 总计
db.users.aggregate([      //聚合的意思，接受一个数组为参数
  {$match:{age:{$exists:true}}},     //这里的$match类似于filter筛选
  {$group:{
    _id:null,    //这里的_id必须存在，null代表所有，没有分组依据
    totalAge:{$sum:"$age"}  //这里字符串必须加$，表示match到的age
  }}
])
//{ "_id" : null, "totalAge" : 11423 }

--------------
#$avg 平均数
db.users.aggregate([
  {$match:{age:{$exists:true},name:{$exists:true}}},
  {$group:{{_id:"$name"},totalAge:{$avg:"$age"}}}
])
//{ "_id" : "neo", "avgAge" : 88 }
{ "_id" : "toy", "avgAge" : 77 }
{ "_id" : "laowang", "avgAge" : 1100 }
{ "_id" : "joy", "avgAge" : 27 }
{ "_id" : "jack", "avgAge" : 3377 }131 }
```

```
#$unwind 展开,拆
db.users.aggregate([
  {$match:{name:"joy",hobbies:{$exists:true}}},
  {$unwind:"$hobbies"}    //拆分的是hobbies
])
//
{ "_id" : ObjectId("5a1ae30cf38d1321a2ce5866"), "name" : "joy", "age" : 27, "hobbies" : "eat" }
{ "_id" : ObjectId("5a1ae30cf38d1321a2ce5866"), "name" : "joy", "age" : 27, "hobbies" : "drink" }
{ "_id" : ObjectId("5a1ae30cf38d1321a2ce5866"), "name" : "joy", "age" : 27, "hobbies" : "hiking" }
```

##### 索引

```
db.users.createIndex({age:1})
//{
	"createdCollectionAutomatically" : false,
	"numIndexesBefore" : 1,
	"numIndexesAfter" : 2,
	"ok" : 1
}
--------
#db.collection.getIndexes() 列举索引
//[
	{
		"v" : 2,
		"key" : {
			"_id" : 1
		},
		"name" : "_id_",
		"ns" : "daodao.users"
	},
	{
		"v" : 2,
		"key" : {
			"age" : 1
		},
		"name" : "age_1",
		"ns" : "daodao.users"
	},
	{
		"v" : 2,
		"key" : {
			"name" : 1
		},
		"name" : "name_1",
		"ns" : "daodao.users"
	},
	{
		"v" : 2,
		"key" : {
			"name" : 1,
			"age" : 1
		},
		"name" : "name_1_age_1",
		"ns" : "daodao.users"
	}
]

```













