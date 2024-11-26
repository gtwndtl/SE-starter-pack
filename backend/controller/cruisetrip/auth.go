package cruisetrip

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "example.com/se/config"
	"example.com/se/entity"
	"time"

)

type (
    addTrip struct {
        Trip_name string `json:"trip_name"`
		Start_date time.Time `json:"start_date"`
		End_date time.Time `json:"end_date"`
		Trip_price float32 `json:"trip_price"`
		Description string `json:"description"`
		Picture string `json:"picture" gorm:"type:longtext"`
		PromotionID uint `json:"promotion_id"`
    }
)

// AddCar handles the addition of a new car
func AddTrip(c *gin.Context) {
    var payload addTrip

    // Bind JSON payload to the struct
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()


    var tripCheck entity.CruiseTrip
 
    if tripCheck.ID != 0 {
 
        // If the user with the provided email already exists
 
        c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})
 
        return
 
    }

    // Create a new car
    cruisetrip := entity.CruiseTrip{
        Trip_name: payload.Trip_name,
        Start_date: payload.Start_date,
        End_date: payload.End_date,
        Trip_price: payload.Trip_price,
        Description: payload.Description,
        Picture: payload.Picture,
        PromotionID: payload.PromotionID,
    }

    // Save the car to the database
    if err := db.Create(&cruisetrip).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"status": 201, "message": "Car added successfully"})
}