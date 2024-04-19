import React, { useState, useEffect, useRef } from "react"
import Box from "@mui/material/Box"
import { Checkbox, TextField } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { makeStyles } from "@mui/styles"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import OngoingPollsPoll from "./ongoingPollsPoll"

const label = { inputProps: { "aria-label": "Checkbox demo" } }
/*
const newPageStyles = makeStyles((theme) => ({
  outerContainer: {
    "&:-webkit-scrollbar": {
      width: "5px",
    },
    "&:-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "&:-webkit-scrollbar-thumb": {
      background: "#888",
    },
    "&:-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    "-ms-overflow-style": "none",
  },
}));
*/

export default function OngoingPolls(props) {
    // const classes = newPageStyles();

    console.log("프롭스확인>>", props)

    const scrollRef = useRef(null)
    const [isDrag, setIsDrag] = useState(false)
    const [startX, setStartX] = useState()
    const startPositionRef = useRef(0)
    const [unclickable, setUnclickable] = useState(true)

    const onDragStart = (e) => {
        e.preventDefault()
        setIsDrag(true)
        setStartX(e.pageX + scrollRef.current.scrollLeft)
        startPositionRef.current = e.pageX
    }
    const onDragEnd = (e) => {
        const moveRange = Math.abs(startPositionRef.current - e.pageX)

        if (moveRange < 20) {
            setUnclickable(false)
            setIsDrag(false)

            return
        }

        setIsDrag(false)
        setUnclickable(true)
    }

    const onDragMove = (e) => {
        if (isDrag) {
            scrollRef.current.scrollLeft = startX - e.pageX
        }
    }

    const PollsMap = () => {
        const data = props.data
        if (data.length === 0) return
        return data.map((el) => <OngoingPollsPoll data={el} unclickable={unclickable} />)
    }
    return (
        <Box>
            <Box className="Title" sx={{ pl: 0.3 }}>
                🔥 Trending
            </Box>
            <Box
                className="outerContainer"
                onMouseDown={onDragStart}
                onMouseMove={onDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                ref={scrollRef}
                sx={{
                    display: "flex",
                    height: "150px",
                    width: "100%",
                    mt: 0.8,
                    letterSpacing: 1.2,
                    borderColor: "grey.500",
                    flexDirection: "row",
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    "-ms-overflow-style": "none",
                    //overflow: "hidden",
                }}
            >
                {PollsMap()}
            </Box>
        </Box>
    )
}
