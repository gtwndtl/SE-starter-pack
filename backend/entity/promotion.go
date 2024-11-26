package entity

import (
   "time"
	"gorm.io/gorm"
)


type Promotion struct {

   gorm.Model

   Name string `json:"name"`
   Details string `json:"details"`
   Code string `json:"code"`
   Start_date time.Time `json:"start_date"`
   End_date time.Time `json:"end_date"`
   Trip_discount float32 `json:"trip_discount"`
   Limit uint `json:"limit"`
   Picture string `json:"picture" gorm:"type:longtext"`
   
   TypeID uint `json:"type_id"`
   Type   *Promotion_type `gorm:"foreignKey: type_id" json:"type"`

   TripID uint `json:"trip_id"`
   Trip   *CruiseTrip `gorm:"foreignKey: trip_id" json:"trip"`

   StatusID uint `json:"status_id"`
   Status   *Promotion_status `gorm:"foreignKey: status_id" json:"status"`
}