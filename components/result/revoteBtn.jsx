import React, { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import { Checkbox, TextField } from "@mui/material"
import { ConstructionOutlined } from "@mui/icons-material"
import defaultImage from "../../public/defaultImage.png"

const label = { inputProps: { "aria-label": "Checkbox demo" } }
export default function RevoteBtn(props) {
    return (
        <Box
            className="outerContainer"
            compomemt="button"
            sx={{
                maxWidth: "100%",
                mt: 1,
                mb: 1,
                borderRadius: "5px",

                boxShadow: 2,
                letterSpacing: 1.2,
                display: "flex",
                borderColor: "grey.500",
                flexDirection: "row",

                alignItems: "center",
                fontSize: 22,
                flex: 0.2,
            }}
        >
            <Box
                sx={{
                    backgroundPosition: "50% 50%",
                    width: 90,
                    height: "100%",
                    mr: 1,
                    backgroundSize: "cover",
                    marginTop: 0,
                    marginBottom: 0,
                    padding: 0,
                    zIndex: 1,
                    backgroundColor: "white",
                    filter: props.data.imageUrl === null ? "brightness(1.15)" : "none",
                }}
            ></Box>
        </Box>
    )
}
