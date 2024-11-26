package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/se/config"

	"example.com/se/controller/genders"
	"example.com/se/controller/promotion"
	
	"example.com/se/controller/promotion_status"

	"example.com/se/controller/promotion_type"

	"example.com/se/controller/users"

	"example.com/se/controller/cruisetrip"

	"example.com/se/middlewares"
)

const PORT = "8000"

func main() {

	// open connection database

	config.ConnectionDB()

	// Generate databases

	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	// Auth Route

	r.POST("/signup", users.SignUp)

	r.POST("/signin", users.SignIn)

	router := r.Group("/")

	{

		router.Use(middlewares.Authorizes())

		// User Route

		router.PUT("/user/:id", users.Update)

		router.GET("/users", users.GetAll)

		router.GET("/user/:id", users.Get)

		router.DELETE("/user/:id", users.Delete)


		router.POST("/promotion", promotion.AddPromotion)

		router.PUT("/promotion/:id", promotion.Update)

		router.GET("/promotions", promotion.GetAll)

		router.GET("/promotion/:id", promotion.Get)

		router.DELETE("/promotion/:id", promotion.Delete)


		router.GET("/cruisetrip", cruisetrip.GetAll)

	}

	r.GET("/genders", genders.GetAll)

	r.GET("/types", promotion_type.GetAll)

	r.GET("/status", promotion_status.GetAll)

	r.GET("/", func(c *gin.Context) {

		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)

	})

	// Run the server

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
