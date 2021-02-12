package models

import "gorm.io/gorm"

type Park struct {
	gorm.Model
	ParkID string
	Name string
	Desc string
	MinimumHeight int
	SeatAvailable int
	Price int
}

type InputPark struct {
	Name string `json:"name" binding:"required"`
	Desc string `json:"desc" binding:"required"`
	MinimumHeight int `json:"minimum_height" binding:"required"`
	SeatAvailable int `json:"seat_available" binding:"required"`
	Price int `json:"price" binding:"required"`
	Pin int `json:"pin" binding:"required"`
}
