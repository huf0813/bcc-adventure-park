package config

import (
	"bcc/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB()  {
	var err error
	dsn := "root:@tcp(127.0.0.1:3306)/bcc?charset=utf8mb4&parseTime=True&loc=Local"
  	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	DB.AutoMigrate(&models.User{})
  	DB.AutoMigrate(&models.Invoice{})
}
