package routes

import (
	"bcc/config"
	"bcc/models"
	"math/rand"
	"time"

	"github.com/gin-gonic/gin"
)

func CreatePark(c *gin.Context) {
	var parkData models.InputPark
	if err:= c.BindJSON(&parkData); err != nil {
		c.JSON(400, gin.H{
			"message": "Wrong Parameter",
			"status": "error",
		})
		c.Abort()
		return
	}

	var isAdmin string = c.MustGet("jwt_user_role").(string)
	if isAdmin != "admin" {
		c.JSON(403, gin.H{
			"message": "Forbidden Request",
			"status": "error",
		})
		c.Abort()
		return
	}

	var userData models.User
	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	config.DB.First(&userData, "id = ?", userId)
	if parkData.Pin != userData.Pin {
		c.JSON(403, gin.H{
			"message": "Wrong Pin",
			"status": "error",
		})
		c.Abort()
		return
	}

	park := models.Park{
		ParkID: generateIdentifierPark(),
		Name: parkData.Name,
		Desc: parkData.Desc,
		MinimumHeight: parkData.MinimumHeight,
		SeatAvailable: parkData.SeatAvailable,
		Price: parkData.Price,
	}
	if err := config.DB.Create(&park).Error; err != nil {
		c.JSON(500, gin.H{
			"message": "Internal Server Error",
			"status": "error",
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{
		"park_identity" : park.ParkID,
		"message": "Successfully created a Park",
		"status": "success",
	})
}

func GetParkDetail(c *gin.Context)  {
	ident := c.Param("parkid")

	var park models.Park
	if err := config.DB.First(&park, "park_id = ?", ident).Error; err != nil  {
		c.JSON(404, gin.H{
			"message": "Park Not Found",
			"status": "error",
		})
		c.Abort()
		return
	}

	type ParkDetail struct {
		Name string
		Desc string
		MinimumHeight int
		SeatAvailable int
		Price int
	}
	detailPark := ParkDetail{park.Name, park.Desc, park.MinimumHeight, park.SeatAvailable, park.Price}

	c.JSON(200, gin.H{
		"data": detailPark,
		"status": "success",
	})
}

func UpdatePark(c *gin.Context)  {
	var newPark models.InputPark
	if err := c.BindJSON(&newPark); err != nil {
		c.JSON(400, gin.H{
			"message": "Wrong Parameter",
			"status": "error",
		})
		c.Abort()
		return
	}

	var isAdmin string = c.MustGet("jwt_user_role").(string)
	if isAdmin != "admin" {
		c.JSON(403, gin.H{
			"message": "Forbidden Request",
			"status": "error",
		})
		c.Abort()
		return
	}

	var userData models.User
	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	config.DB.First(&userData, "id = ?", userId)
	if newPark.Pin != userData.Pin {
		c.JSON(403, gin.H{
			"message": "Wrong Pin",
			"status": "error",
		})
		c.Abort()
		return
	}

	ident := c.Param("parkid")
	var parkExist models.Park
	if err := config.DB.First(&parkExist, "park_id = ?", ident).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "Park Not Found",
			"status": "error",
		})
		c.Abort()
		return
	}

	parkExist.Name = newPark.Name
	parkExist.Desc = newPark.Desc
	parkExist.MinimumHeight = newPark.MinimumHeight
	parkExist.SeatAvailable = newPark.SeatAvailable
	parkExist.Price = newPark.Price
	config.DB.Save(&parkExist)
	c.JSON(200, gin.H{
		"message": "Successfully Edited",
		"status": "success",
	})
}

func DeletePark(c *gin.Context)  {
	parkId := c.Param("parkid")
	var parkExist models.Park
	if err := config.DB.First(&parkExist, "park_id = ?", parkId).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "Park Not Found",
			"status": "error",
		})
		c.Abort()
		return
	}

	var isAdmin string = c.MustGet("jwt_user_role").(string)
	if isAdmin != "admin" {
		c.JSON(403, gin.H{
			"message": "Forbidden Request",
			"status": "error",
		})
		c.Abort()
		return
	}

	var userData models.User
	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	config.DB.First(&userData, "id = ?", userId)
	var inputPin models.InputPin
	if err := c.BindJSON(&inputPin); err != nil {
		c.JSON(403, gin.H{
			"message": "Wrong parameter",
			"status": "error",
		})
		c.Abort()
		return
	}
	if inputPin.Pin != userData.Pin {
		c.JSON(403, gin.H{
			"message": "Wrong Pin",
			"status": "error",
		})
		c.Abort()
		return
	}

	config.DB.Delete(&parkExist)
	c.JSON(200, gin.H{
		"message": "successfully removed",
		"status": "success",
	})
}

func generateIdentifierPark() string {
	var park models.Park
	var b []rune
	for i := 0; i < 1; i++ {
		i--
		letters := []rune("123456789")
		rand.Seed(time.Now().UnixNano())
		b = make([]rune, 6)
		for i := range b {
			b[i] = letters[rand.Intn(len(letters))]
		}
		err := config.DB.First(&park, "identifier = ?", string(b)).Error
		if err != nil {
			i++
		}
	}
	return string(b)
}
