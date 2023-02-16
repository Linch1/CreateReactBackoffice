import { useEffect, useState } from "react";
import { Navbar, Button } from "flowbite-react";
import styles from "./styles.module.css"

export default function MainNavbar({ links }){
    
    return (

    <div className={styles['main-navbar']}>

      <div className={"container mx-auto w-full"} >
        <Navbar
          fluid={true}
          rounded={true}

          id="main-navbar"

          className={"w-full flex  justify-around " }
          >   

          <div className="w-full flex flex-wrap items-center justify-between">

            <div className="flex align-center ">

              <Navbar.Brand href="/">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="mr-3 h-6 sm:h-9"
                  alt="Flowbite Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                  BackOffice Creator
                </span>
              </Navbar.Brand>
                  
              <Navbar.Collapse className="sm:hidden md:flex ml-4 items-center">
                {
                  Object.keys(links).map( (linkName, i) => {
                    return <Navbar.Link
                      href={links[linkName]}
                      active={true}
                      className={styles['navbar-link']}
                    >
                      {linkName}
                    </Navbar.Link>
                  })
                }
              </Navbar.Collapse>
                
            </div>

        
          </div>
      
        </Navbar>

      </div>

    </div>

    )
}