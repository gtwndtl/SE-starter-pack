package config


import (

   "fmt"

   "time"

   "example.com/se/entity"

   "gorm.io/driver/sqlite"

   "gorm.io/gorm"

)


var db *gorm.DB


func DB() *gorm.DB {

   return db

}


func ConnectionDB() {

   database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})

   if err != nil {

       panic("failed to connect database")

   }

   fmt.Println("connected database")

   db = database

}


func SetupDatabase() {


   db.AutoMigrate(

       &entity.Users{},

       &entity.Genders{},

       &entity.Promotion{},

       &entity.CruiseTrip{},

       &entity.Promotion_type{},

       &entity.Promotion_status{},

   )


   GenderMale := entity.Genders{Gender: "Male"}

   GenderFemale := entity.Genders{Gender: "Female"}


   db.FirstOrCreate(&GenderMale, &entity.Genders{Gender: "Male"})

   db.FirstOrCreate(&GenderFemale, &entity.Genders{Gender: "Female"})


   TripType := entity.Promotion_type{Type: "Trip"}

   CabinType := entity.Promotion_type{Type: "Cabin"}
   
   FoodType := entity.Promotion_type{Type: "Food"}


   db.FirstOrCreate(&TripType, &entity.Promotion_type{Type: "Trip"})

   db.FirstOrCreate(&CabinType, &entity.Promotion_type{Type: "Cabin"})

   db.FirstOrCreate(&FoodType, &entity.Promotion_type{Type: "Food"})


   StatusActive := entity.Promotion_status{Status: "Active"}

   StatusFull := entity.Promotion_status{Status: "Full"}
   
   StatusExpired := entity.Promotion_status{Status: "Expired"}


   db.FirstOrCreate(&StatusActive, &entity.Promotion_status{Status: "Active"})

   db.FirstOrCreate(&StatusFull, &entity.Promotion_status{Status: "Full"})

   db.FirstOrCreate(&StatusExpired, &entity.Promotion_status{Status: "Expired"})

   hashedPassword, _ := HashPassword("1")

   BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")

   User := &entity.Users{

       FirstName: "Software",

       LastName:  "Analysis",

       Email:     "1@gmail.com",

       Age:       80,

       Password:  hashedPassword,

       BirthDay:  BirthDay,

       GenderID:  1,

   }

   db.FirstOrCreate(User, &entity.Users{

       Email: "1@gmail.com",

   })


}