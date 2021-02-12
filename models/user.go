package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Identifier string
	Name string
	Email string
	Pin int
	Balance int
	Role string
	Invoices []Invoice `gorm:"foreignKey:UserID"`
}

type RegitserUser struct {
	Name string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required"`
	Pin int `json:"pin" binding:"required,min=100000,max=999999"`
}

type LoginUser struct {
	Email string `json:"email" binding:"required"`
	Pin int `json:"pin" binding:"required"`
}

type InputPin struct {
	Pin int `json:"pin" binding:"required"`
}

type AddBalance struct {
	Pin int `json:"pin" binding:"required"`
	Amount int `json:"amount" binding:"required"`
}

type UserProfile struct {
	Identifier string `json:"identifier"`
	Name string `json:"name"`
	Email string `json:"email"`
	Balance int `json:"balance"`
}

type EditBalance struct {
	Pin int `json:"pin" binding:"required"`
	Amount int `json:"amount" binding:"required"`
}
