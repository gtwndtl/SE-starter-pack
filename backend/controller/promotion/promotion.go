package promotion


import (

   "net/http"


   "github.com/gin-gonic/gin"


   "example.com/se/config"

   "example.com/se/entity"

)


func GetAll(c *gin.Context) {


   var promotions []entity.Promotion


   db := config.DB()
    results := db.Find(&promotions)

   if results.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

       return

   }

   c.JSON(http.StatusOK, promotions)


}


func Get(c *gin.Context) {


   ID := c.Param("id")

   var promotion entity.Promotion


   db := config.DB()
   results := db.First(&promotion, ID)

   if results.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

       return

   }

   if promotion.ID == 0 {

       c.JSON(http.StatusNoContent, gin.H{})

       return

   }

   c.JSON(http.StatusOK, promotion)


}


func Update(c *gin.Context) {


   var promotion entity.Promotion


   PromotionID := c.Param("id")


   db := config.DB()

   result := db.First(&promotion, PromotionID)

   if result.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})

       return

   }


   if err := c.ShouldBindJSON(&promotion); err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})

       return

   }


   result = db.Save(&promotion)

   if result.Error != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})

       return

   }


   c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})

}


func Delete(c *gin.Context) {


    id := c.Param("id")
 
    db := config.DB()
 
    if tx := db.Exec("DELETE FROM promotions WHERE id = ?", id); tx.RowsAffected == 0 {
 
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
 
        return
 
    }
 
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
 
 }