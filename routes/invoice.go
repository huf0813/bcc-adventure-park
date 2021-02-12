package routes

import (
	"bcc/config"
	"bcc/models"
	"math/rand"
	"time"

	"github.com/gin-gonic/gin"
)

func AddInvoice(item string, amount int, isCredit bool, user_id uint) bool {
	invoice := models.Invoice{
		InvoiceID: generateInvoiceID(),
		Item: item,
		Amount: amount,
		IsCredit: isCredit,
		UserID: user_id,
	}

	if err := config.DB.Create(&invoice).Error; err != nil {
		return false
	} else {
		return true
	}
}

func GetAllInvoices(c *gin.Context)  {
	var userLogin uint = uint(c.MustGet("jwt_user_id").(float64))
	type APIinvoices struct {
		InvoiceID string
	}
	var invoices []APIinvoices
	config.DB.Raw("SELECT invoice_id FROM invoices WHERE user_id = ?", userLogin).Scan(&invoices)
	
	c.JSON(200, gin.H{
		"data": invoices,
		"status": "success",
	})
}

func GetInvoice(c *gin.Context) {
	invoiceid := c.Param("invoiceid")

	var invoiceExist models.Invoice
	if err := config.DB.Find(&invoiceExist, "invoice_id = ?", invoiceid).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "Invoice Not Found",
			"status": "error",
		})
		c.Abort()
		return
	}

	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	if userId != invoiceExist.UserID {
		c.JSON(403, gin.H{
			"message": "Forbidden Request",
			"status": "error",
		})
		c.Abort()
		return
	}

	invoiceData := models.InvoiceDetail{
		InvoiceID: invoiceExist.InvoiceID,
		Item: invoiceExist.Item,
		Amount: invoiceExist.Amount,
		IsCredit: invoiceExist.IsCredit,
	}
	c.JSON(200, gin.H{
		"data": invoiceData,
		"status": "sukses",
	})
}

func generateInvoiceID() string {
	var invoice models.Invoice
	var b []rune
	for i := 0; i < 1; i++ {
		i--
		letters := []rune("123456789")
		rand.Seed(time.Now().UnixNano())
		b = make([]rune, 6)
		for i := range b {
			b[i] = letters[rand.Intn(len(letters))]
		}
		err := config.DB.First(&invoice, "invoice_id = ?", string(b)).Error
		if err != nil {
			i++
		}
	}
	return string(b)
}
