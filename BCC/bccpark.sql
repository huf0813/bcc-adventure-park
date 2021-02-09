create database bccpark
use bccpark

create table park (
park_id int identity(1,1) primary key,
name varchar(50) not null,
location varchar(70) not null,
price int not null,
regdate date not null
)

create table visitor (
visitor_id int identity(1,1) primary key,
name varchar(50) not null,
telp varchar(25) not null,
email varchar(50) not null,
username varchar(25) not null unique,
password varchar(25) not null,
regdate date not null,
balance int not null default 0
)

exec regvisitor 'admin','admin','admin','admin','admin';

go
create or alter procedure regpark (@name varchar(50),@location varchar(70),@price int)
as
declare @maxp int;
select @maxp = max(park_id) from park;
if @maxp is null
	set @maxp = 0
dbcc CHECKIDENT('park',RESEED,@maxp)
insert into park values (@name,@location,@price,getdate())

go
create or alter procedure getparkdetail(@pid int)
as
select * from park where park_id=@pid

go
create or alter procedure editpark(@oldname varchar(50),@name varchar(50),@location varchar(70),@price int)
as
update park
set name=@name,location=@location,price=@price
where @oldname=name

go
create or alter procedure delpark(@id int)
as
delete from park where park_id=@id

go
create or alter procedure regvisitor (@name varchar(50),@email varchar(50),@telp varchar(25),@uname varchar(25),@pw varchar(25))
as
declare @maxv int;
select @maxv = max(visitor_id) from visitor;
if(@maxv>1)
begin
dbcc CHECKIDENT('visitor',RESEED,@maxv)
end
insert into visitor values (@name,@email,@telp,@uname,@pw,getdate(),0)

go
create or alter procedure getvisid
as
select visitor_id from visitor 

go
create or alter procedure auth(@uname varchar(25),@pw varchar(25))
as
select visitor_id from visitor where @uname=username and @pw=password

go
create or alter procedure topup(@vid int,@money int)
as
update visitor 
set balance+=@money
where visitor_id=@vid

go
create or alter procedure getbalance(@vid int)
as
select balance from visitor where @vid=visitor_id

go
create or alter procedure visit(@vid int,@park_id int)
as
update visitor
set visitor.balance-=prk.price
from visitor,park prk
where prk.park_id=@park_id and @vid=visitor_id

go
create or alter procedure getvisdetail(@vid int)
as
select * from visitor where @vid=visitor_id

go
create or alter procedure editbalance(@vid int,@balance int)
as
update visitor
set balance=@balance
where @vid=visitor_id

go
create or alter procedure delacc(@vid int)
as
delete from visitor where visitor_id=@vid

go
create or alter procedure chuname(@vid int,@uname varchar(25))
as
update visitor
set username=@uname
where @vid=visitor_id

go
create or alter procedure chpw(@vid int,@pw varchar(25))
as
update visitor
set password=@pw
where @vid=visitor_id

go
create or alter procedure chvis(@vid int,@name varchar(50),@email varchar(50),@telp varchar(25))
as
update visitor
set name=@name,email=@email,telp=@telp
where @vid=visitor_id