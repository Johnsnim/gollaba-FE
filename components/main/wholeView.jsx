import React, { useState, useEffect, useRef } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import BottomNavigation from "@mui/material/BottomNavigation"
import BottomNavigationAction from "@mui/material/BottomNavigationAction"
import { Icon, TextField } from "@mui/material"
import { useInView } from "react-intersection-observer"

import PollsMap from "../main/mapPoll"
import theme from "../../src/theme"
import ApiGateway from "../../apis/ApiGateway"
import { useCookies } from "react-cookie"
import { useRouter } from "next/router"

const PollTheme = createTheme(theme)

export default function WholeView({ data, favorites }) {
    const router = useRouter()
    const [polls, setPolls] = useState([])
    const [ref, inView] = useInView()
    const [isLoading, setIsLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [cookies, setCookies, removeCookies] = useCookies([])
    const inputRef = useRef(null)
    let response
    const limit = 15

    const getData = async () => {
        if (totalCount !== 0 && offset * 15 >= totalCount) return
        setIsLoading(true)
        response = await ApiGateway.getPolls(offset, limit, null)
        setPolls([...polls, ...response.data.items])
        setTotalCount(response.totalCount)
        setIsLoading(false)
    }

    useEffect(() => {
        getData()
    }, [offset])

    useEffect(() => {
        if (inView && !isLoading) {
            setOffset((prevState) => prevState + 1)
        }
    }, [inView, isLoading])

    const handleSubmit = (event) => {
        event.preventDefault()
        router.push(`/search/${inputRef.current.value}`)
        return
    }

    if (polls !== undefined)
        return (
            <Box sx={{ mt: 3, mb: 3 }}>
                <Box className="Title" sx={{ pl: 0.3, mt: 0.3, display: "flex", flexDirection: "row" }}>
                    <Box sx={{ display: "flex" }}>📝 전체 투표</Box>
                    <Box sx={{ display: "flex", flex: 1 }} />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            border: 1,
                            borderRadius: 2,
                            borderColor: "grey.300",
                            boxShadow: "0 0 5px 1px rgba(0,0,0,0.055)",
                        }}
                    >
                        {/*
                        <form onSubmit={handleSubmit}>
                            <button type="submit" style={{ backgroundColor: "transparent", border: "none" }}>
                                🔍
                            </button>
                            <input
                                type="text"
                                placeholder="원하는 투표 찾아보기"
                                style={{ width: "150px", height: "25px", border: "none", paddingRight: "10px" }}
                                ref={inputRef}
                            />
                        </form>
                    */}
                    </Box>
                </Box>

                <Box display={"flex"} flexDirection={"column"} flex={"1"}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            overflow: "auto",
                            // maxHeight: "90vh",
                            mt: 0,
                            pl: 1.2,
                            pr: 1.2,
                        }}
                    >
                        <PollsMap data={polls} favorites={favorites} />
                    </Box>
                </Box>
                <Box ref={ref} />
            </Box>
        )
}
