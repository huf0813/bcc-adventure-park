package routes

import (
	"bcc/config"
	"bcc/models"

	"github.com/gin-gonic/gin"
)

func PutTopUpBalance(c *gin.Context)  {
	var dataInput models.AddBalance
	if err := c.BindJSON(&dataInput); err != nil {
		c.JSON(400, gin.H{
			"message": "Wrong Parameter",
			"status": "error",
		})
		c.Abort()
		return
	}
	
	var userExist models.User
	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	if err := config.DB.First(&userExist, "id = ?", userId).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "Forbidden Request",
			"status": "error",
		})
		c.Abort()
		return
	}

	if userExist.Pin != dataInput.Pin {
		c.JSON(403, gin.H{
			"message": "Wrong Pin",
			"status": "error",
		})
		c.Abort()
		return
	}

	AddInvoice("Add Balance", dataInput.Amount, true, userId)
	
	userExist.Balance += dataInput.Amount
	config.DB.Save(&userExist)
	c.JSON(200, gin.H{
		"balance": userExist.Balance,
		"message": "successfully top-up balance",
		"status": "success",
	})
}

func GetUserBalance(c *gin.Context)  {
	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	var user models.User

	if err:= config.DB.First(&user, "id = ?", userId).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User not Found",
			"status": "error",
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{
		"balance": user.Balance,
		"status": "success",
	})
}

func GetUserProfile(c *gin.Context)  {
	var user models.User
	var userId uint = uint(c.MustGet("jwt_user_id").(float64))

	if err:= config.DB.First(&user, "id = ?", userId).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User not Found",
			"status": "error",
		})
		c.Abort()
		return
	}

	userProfile := models.UserProfile{
		Identifier: user.Identifier,
		Name: user.Name,
		Email: user.Email,
		Balance: user.Balance,
	}

	c.JSON(200, gin.H{
		"data": userProfile,
		"status": "success",
	})
}

func PutVisitPark(c *gin.Context)  {
	parkid := c.Param("parkid")
	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	var user models.User
	if err := config.DB.First(&user, "id = ?", userId).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User not found",
			"status": "error",
		})
		c.Abort()
		return
	}

	var park models.Park
	if err := config.DB.First(&park, "park_id = ?", parkid).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "Park not found",
			"status": "error",
		})
		c.Abort()
		return
	}

	var intputPinModel models.InputPin
	if err := c.BindJSON(&intputPinModel); err != nil {
		c.JSON(403, gin.H{
			"message": "Pin must be inputed",
			"status": "error",
		})
		c.Abort()
		return
	}

	if intputPinModel.Pin != user.Pin {
		c.JSON(406, gin.H{
			"message": "Wrong Pin",
			"status": "error",
		})
		c.Abort()
		return
	}

	if user.Balance < park.Price {
		c.JSON(403, gin.H{
			"message": "Balance not enough",
			"status": "error",
		})
		c.Abort()
		return
	} else {
		isTrue := AddInvoice("Entered " + park.Name, park.Price, false, userId)
		if isTrue {
			user.Balance = user.Balance - park.Price
			config.DB.Save(&user)
			c.JSON(200, gin.H{
				"message": "successfully expensing balance",
				"status": "success",
			})
		} else {
			c.JSON(500, gin.H{
				"message": "Internal Server Error",
				"status": "error",
			})
		}
	}
}

func UpdateBalance(c *gin.Context)  {
	var userInput models.EditBalance
	if err := c.BindJSON(&userInput); err != nil {
		c.JSON(400, gin.H{
			"message": "Wrong Parameter",
			"status": "error",
		})
		c.Abort()
		return
	}

	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	var user models.User
	if err := config.DB.First(&user, "id = ?", userId).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User not found",
			"status": "error",
		})
		c.Abort()
		return
	}

	if userInput.Pin != user.Pin {
		c.JSON(403, gin.H{
			"message": "Wrong pin",
			"status": "error",
		})
		c.Abort()
		return
	}

	user.Balance = userInput.Amount
	config.DB.Save(&user)
	c.JSON(200, gin.H{
		"amount": user.Balance,
		"message": "successfully edited",
		"status": "success",
	})
}

func DeleteUser(c *gin.Context)  {
	var userId uint = uint(c.MustGet("jwt_user_id").(float64))
	var user models.User
	if err := config.DB.First(&user, "id = ?", userId).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User not found",
			"status": "error",
		})
		c.Abort()
		return
	}

	config.DB.Delete(&user)
	c.JSON(200, gin.H{
		"message": "Successfully Deleted Account",
		"status": "error",
	})
}
