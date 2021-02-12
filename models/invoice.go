package models

import "gorm.io/gorm"

type Invoice struct {
	gorm.Model
	InvoiceID string
	Item string
	Amount int
	IsCredit bool
	UserID uint
}

type InvoiceDetail struct {
	InvoiceID string `json:"invoice_id"`
	Item string `json:"item"`
	Amount int `json:"amount"`
	IsCredit bool `json:"is_credit"`
}
