package promotion

import (
	"errors"
	"net/http"
	"time"

	"example.com/se/config"
	"example.com/se/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// addRent represents the structure of the rent data in the request body
type addPromotion struct {
    Name string `json:"name"`
    Details string `json:"details"`
    Code string `json:"code"`
    Start_date time.Time `json:"start_date"`
    End_date time.Time `json:"end_date"`
    Trip_discount float32 `json:"trip_discount"`
    Status string `json:"status"`
    Limit uint `json:"limit"`
    
    Picture string `json:"picture" gorm:"type:longtext"`
	TypeID uint `json:"type_id"`
	TripID uint `json:"trip_id"`
    StatusID uint `json:"status_id"`
}

// AddRent handles the addition of a new rent record
func AddPromotion(c *gin.Context) {
    var payload addPromotion

    // Bind JSON payload to the struct
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Validate that StartRent is before EndRent
    if payload.Start_date.After(payload.End_date) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "StartPromotion must be before EndPromotion"})
        return
    }

    db := config.DB()

    var codeCheck entity.Promotion

    // Check if the promotion with the provided code already exists
    result := db.Where("code = ? AND type_id = ?", payload.Code,payload.TypeID).First(&codeCheck)
    
    if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
        // หากเกิดข้อผิดพลาดจาก database ที่ไม่ใช่กรณีไม่มีข้อมูล
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    
    if codeCheck.ID != 0 {
        // หากพบโปรโมชั่นที่มีรหัสซ้ำ
        c.JSON(http.StatusConflict, gin.H{"status": 409, "error": "Promotion with this code already exists"})
        return
    }
    

    // Create a new rent record
    promotion := entity.Promotion{
        Name: payload.Name,
        Details: payload.Details,
        Code: payload.Code,
        Start_date: payload.Start_date,
        End_date: payload.End_date,
        Trip_discount: payload.Trip_discount,
        Limit: payload.Limit,
    
        Picture: payload.Picture,
	    TypeID: payload.TypeID,
	    TripID: payload.TripID,
    }

    // Save the rent record to the database
    if err := db.Create(&promotion).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Return the rent ID in the response
    c.JSON(http.StatusCreated, gin.H{
        "status":  201,
        "message": "Promotion added successfully",
        "promotion_id": promotion.ID, // ส่ง ID ของ Promotion กลับไปยัง client
    })
}