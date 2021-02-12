package main

import (
	"bcc/config"
	"bcc/middleware"
	"bcc/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitDB()

	route := gin.Default()
	
	api := route.Group("/api")
	{
		auth := api.Group("/auth/")
		{
			auth.POST("/register", routes.PostRegisterUser)
			auth.POST("/login", routes.PostLogin)
		}
		user := api.Group("/user/")
		{
			user.PUT("/topup/", middleware.IsAuth(), routes.PutTopUpBalance)
			user.GET("/balance/", middleware.IsAuth(), routes.GetUserBalance)
			user.PUT("/edit-balance/", middleware.IsAuth(), routes.UpdateBalance)
			user.PUT("/visit-park/:parkid", middleware.IsAuth(), routes.PutVisitPark)
			user.GET("/invoices/", middleware.IsAuth(), routes.GetAllInvoices)
			user.GET("/invoice/:invoiceid", middleware.IsAuth(), routes.GetInvoice)
			user.GET("/profile/", middleware.IsAuth(), routes.GetUserProfile)
			user.DELETE("/delete/", middleware.IsAuth(), routes.DeleteUser)
		}
		park := api.Group("/park/")
		{
			park.POST("/new", middleware.IsAuth(), routes.CreatePark)
			park.GET("/:parkid", routes.GetParkDetail)
			park.PUT("/edit/:parkid", middleware.IsAuth(), routes.UpdatePark)
			park.DELETE("/delete/:parkid", middleware.IsAuth(), routes.DeletePark)
		}
	}

	route.Run()
}
