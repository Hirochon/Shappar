package planetscaleconnection

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func NewPlanetScaleClient(mysqlUser, mysqlPassword, mysqlHost, mysqlDatabase, mysqlExtraProperties string) (*sql.DB, error) {
	planetScaleClient, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true&loc=Local%s", mysqlUser, mysqlPassword, mysqlHost, mysqlDatabase, mysqlExtraProperties))
	if err != nil {
		fmt.Println(err)
	}
	// https://tutuz-tech.hatenablog.com/entry/2020/03/24/170159
	planetScaleClient.SetMaxOpenConns(25)
	planetScaleClient.SetMaxIdleConns(25)
	planetScaleClient.SetConnMaxLifetime(5 * time.Minute)
	return planetScaleClient, nil
}
