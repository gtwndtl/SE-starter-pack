package entity

import (
   "time"
	"gorm.io/gorm"
)


type CruiseTrip struct {

   gorm.Model

   Trip_name string `json:"trip_name"`
   Start_date time.Time `json:"start_date"`
   End_date time.Time `json:"end_date"`
   Trip_price float32 `json:"trip_price"`
   Description string `json:"description"`
   Picture string `json:"picture" gorm:"type:longtext"`
  
   PromotionID uint `json:"promotion_id"`
   Promotion   *Promotion `gorm:"foreignKey: promotion_id" json:"promotion"`
}