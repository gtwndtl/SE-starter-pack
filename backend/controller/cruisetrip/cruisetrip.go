package cruisetrip


import (

   "net/http"


   "github.com/gin-gonic/gin"


   "example.com/se/config"

   "example.com/se/entity"

)


func GetAll(c *gin.Context) {


   var cruisetrips []entity.CruiseTrip


   db := config.DB()
    results := db.Find(&cruisetrips)

   if results.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

       return

   }

   c.JSON(http.StatusOK, cruisetrips)


}


func Get(c *gin.Context) {


   ID := c.Param("id")

   var cruisetrip entity.CruiseTrip


   db := config.DB()
   results := db.First(&cruisetrip, ID)

   if results.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

       return

   }

   if cruisetrip.ID == 0 {

       c.JSON(http.StatusNoContent, gin.H{})

       return

   }

   c.JSON(http.StatusOK, cruisetrip)


}


func Update(c *gin.Context) {


   var cruisetrip entity.CruiseTrip


   CruisetripID := c.Param("id")


   db := config.DB()

   result := db.First(&cruisetrip, CruisetripID)

   if result.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})

       return

   }


   if err := c.ShouldBindJSON(&cruisetrip); err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})

       return

   }


   result = db.Save(&cruisetrip)

   if result.Error != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})

       return

   }


   c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})

}


func Delete(c *gin.Context) {


   id := c.Param("id")

   db := config.DB()

   if tx := db.Exec("DELETE FROM cruisetrip WHERE id = ?", id); tx.RowsAffected == 0 {

       c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})

       return

   }

   c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}