package promotion_status


import (

   "net/http"


   "example.com/se/config"

   "example.com/se/entity"

   "github.com/gin-gonic/gin"

)


func GetAll(c *gin.Context) {


   db := config.DB()


   var status []entity.Promotion_status

   db.Find(&status)


   c.JSON(http.StatusOK, &status)


}