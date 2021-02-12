package routes

import (
	"bcc/config"
	"bcc/models"
	"fmt"
	"math/rand"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var JWT_SECRET = os.Getenv("JWT_SECRET")

func PostRegisterUser(c *gin.Context) {
	var userInput models.RegitserUser

	if err := c.BindJSON(&userInput); err != nil {
		c.JSON(400, gin.H{
			"message": "Wrong Parameter",
			"status":  "error",
		})
		c.Abort()
		return
	}

	var userExist models.User
	if err := config.DB.First(&userExist, "email = ?", userInput.Email).Error; err == nil {
		c.JSON(409, gin.H{
			"message": "Email is already Taken",
			"status":  "error",
		})
		c.Abort()
		return
	}
	
	user := models.User{
		Identifier: generateIdentifier(),
		Name:       userInput.Name,
		Email:      userInput.Email,
		Pin:        userInput.Pin,
		Balance:    0,
		Role: "visitor",
	}

	err := config.DB.Create(&user).Error
	if err != nil {
		c.JSON(400, gin.H{
			"message": "System Busy",
			"status":  "error",
		})
		c.Abort()
		return
	}

	c.JSON(200, gin.H{
		"identity": user.Identifier,
		"message":  "Successfully created account",
		"status":   "success",
	})
}

func PostLogin(c *gin.Context)  {
	var dataLogin models.LoginUser
	if err := c.BindJSON(&dataLogin); err != nil {
		c.JSON(400, gin.H{
			"message": "Wrong Parameter",
			"status": "error",
		})
		c.Abort()
		return
	}

	var dataUser models.User
	if err := config.DB.First(&dataUser, "email = ?", dataLogin.Email).Error; err != nil {
		c.JSON(404, gin.H{
			"message": "User Not found",
			"status": "error",
		})
		c.Abort()
		return
	}

	if dataLogin.Pin != dataUser.Pin {
		c.JSON(406, gin.H{
			"message": "Wrong pin",
			"status": "error",
		})
		c.Abort()
		return
	}

	var jwtToken = generateToken(&dataUser)

	c.JSON(200, gin.H{
		"message": "Welcome " + dataUser.Name,
		"token": jwtToken,
		"status": "success",
	})
}

func generateToken(user *models.User) string {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"user_role": user.Role,
		"exp": time.Now().AddDate(0, 0, 7).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := jwtToken.SignedString([]byte(JWT_SECRET))
	if err != nil {
		fmt.Println(err)
	}

	return tokenString
}

func generateIdentifier() string {
	var user models.User
	var b []rune
	for i := 0; i < 1; i++ {
		i--
		letters := []rune("123456789")
		rand.Seed(time.Now().UnixNano())
		b = make([]rune, 6)
		for i := range b {
			b[i] = letters[rand.Intn(len(letters))]
		}
		err := config.DB.First(&user, "identifier = ?", string(b)).Error
		if err != nil {
			i++
		}
	}
	return string(b)
}
