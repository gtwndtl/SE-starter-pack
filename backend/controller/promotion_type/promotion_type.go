package promotion_type


import (

   "net/http"


   "example.com/se/config"

   "example.com/se/entity"

   "github.com/gin-gonic/gin"

)


func GetAll(c *gin.Context) {


   db := config.DB()


   var types []entity.Promotion_type

   db.Find(&types)


   c.JSON(http.StatusOK, &types)


}