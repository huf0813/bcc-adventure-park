package middleware

import (
	"fmt"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)


var JWT_SECRET = os.Getenv("JWT_SECRET")

func IsAuth() gin.HandlerFunc {
	return checkJWT()
}

func checkJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		bearerToken := strings.Split(authHeader, " ")

		if len(bearerToken) != 2 {
			c.JSON(422, gin.H{
				"message": "Invalid Authorization",
				"status": "error",
			})
			c.Abort()
			return
		}

		token, err := jwt.Parse(bearerToken[1], func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexprected signing method: %v", token.Header["alg"])
			}
			return []byte(JWT_SECRET), nil
		})

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("jwt_user_id", claims["user_id"])
			c.Set("jwt_user_role", claims["user_role"])
		} else {
			c.JSON(422, gin.H{
				"error": err,
				"message": "Invalid Token",
				"status": "error",
			})
			c.Abort()
			return
		}
	}
}
