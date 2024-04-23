import { Avatar, Box, IconButton, TextField, Button, CssBaseline } from "@mui/material"
import { useRef, useState, useEffect } from "react"
import jwt from "jsonwebtoken"
import EditIcon from "@mui/icons-material/Edit"
import DoneOutlineIcon from "@mui/icons-material/DoneOutline"
import ApiGateway from "../../apis/ApiGateway"
import ImageIcon from "@mui/icons-material/Image"
import jwt_decode from "jwt-decode"

export default function Profile() {
    // 선언부
    //const [cookies, setCookies, removeCookies] = useCookies([])
    //const [token, setToken] = useState(null)
    const token = useRef("")
    const userId = useRef("")

    const [data, setData] = useState(null)
    const [nickName, setNickName] = useState("")
    const [visible, setVisible] = useState(false)
    const BACKGROUND_BASIC = "https://cdn.pixabay.com/photo/2015/12/01/15/43/black-1072366_960_720.jpg"
    const PROFILE_BASIC = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

    const showUser = async () => {
        console.log("체크")
        //if (!token.current || !userId.current) return

        const userInfo = await ApiGateway.showUser(userId.current, token.current)
        setData(userInfo)
        console.log("유저인포", userInfo)
    }
    useEffect(() => {
        token.current = localStorage.getItem("accessToken")
        console.log(token.current, "토큰")

        userId.current = jwt_decode(token.current).id
    }, [])
    useEffect(() => {
        showUser()
    }, [token])

    //Profile, Background Image 변경
    const profileImageSrc = () => {
        if (data?.data.profileImageUrl == null) return PROFILE_BASIC
        return data?.data.profileImageUrl
    }
    const backgroundImageSrc = () => {
        if (data?.backgroundImageUrl == null) return BACKGROUND_BASIC
        return data?.backgroundImageUrl
    }
    const photoInput = useRef(null)
    const backgroundInput = useRef(null)
    const handleClick = () => {
        photoInput.current.click()
    }
    const handleBackgroundClick = () => {
        backgroundInput.current.click()
    }

    // formData로 이미지 파일 업데이트 하기
    const changeProfile = async (e) => {
        if (!token.current) return

        const photoToAdd = e.target.files[0]

        const formData = new FormData()
        formData.append("image", photoToAdd)
        //formData.append("updateType", "PROFILE_IMAGE")

        const profileChange = await ApiGateway.changeImage(formData, token.current)
        setData(profileChange)
        console.log(profileChange)
    }
    const changeBackground = async (e) => {
        if (!token.current) return
        const photoToAdd = e.target.files[0]

        const formData = new FormData()
        formData.append("backgroundImage", photoToAdd)
        formData.append("updateType", "BACKGROUND_IMAGE")

        const backgroundChange = await ApiGateway.updateForm(formData, token.current)
        setData(backgroundChange)

        location.reload()
    }

    // 닉네임 변경
    const onChangeNicknameHandler = (e) => {
        setNickName(e.target.value)
    }
    const changeNickname = async () => {
        if (!token.current) return

        const payload = {
            name: nickName,
        }

        const nickChange = await ApiGateway.changeName(payload, token.current)
        setData(nickChange)
        location.reload()
    }

    // 배경화면 스타일 CSS
    const backgroundStyle = {
        backgroundColor: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: 200,
        width: 390,
        padding: 0,
        marginTop: 0,
        alignItems: "center",
        justifyContent: "center",
    }
    const imageStyle = {
        height: 200,
        width: 390,
        // objectFit: 'none',
        objectPosition: "center",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        // postion: "absolute",
        zIndex: 1,
    }

    return (
        <>
            <Box
                sx={{
                    marginTop: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <div>
                    <div style={backgroundStyle}>
                        <img
                            style={imageStyle}
                            src={backgroundImageSrc()}
                            alt="bgImg"
                            onClick={handleBackgroundClick}
                        ></img>
                        <ImageIcon
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                zIndex: 4,
                                fontSize: 40,
                                color: "white",
                            }}
                        />
                        <input
                            type="file"
                            id="backgroundImageInput"
                            style={{ display: "none" }}
                            accept="image/jpg image/jpeg image/png"
                            onChange={(e) => {
                                changeBackground(e)
                            }}
                            ref={backgroundInput}
                        />

                        <Avatar
                            src={profileImageSrc()}
                            id="profileImage"
                            sx={{
                                width: 150,
                                height: 150,
                                objectFit: "cover",
                                position: "absolute",
                                marginTop: 23,
                                zIndex: 1,
                            }}
                            onClick={handleClick}
                        />
                        <input
                            type="file"
                            id="profileImageInput"
                            style={{ display: "none" }}
                            accept="image/jpg image/jpeg image/png"
                            onChange={(e) => changeProfile(e)}
                            ref={photoInput}
                        />
                        <ImageIcon
                            style={{ position: "absolute", fontSize: 40, zIndex: 1, right: "120px", top: "230px" }}
                        />
                    </div>
                </div>

                <div style={{ fontSize: "24px" }}>
                    <Box
                        sx={{
                            marginTop: 10,
                            marginBottom: 5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box sx={{ pl: 4 }}>
                            {data?.data.name}
                            <IconButton
                                aria-label="edit"
                                onClick={() => {
                                    setVisible(!visible)
                                }}
                            >
                                <EditIcon style={{ margin: "0 0 7 1" }} />
                            </IconButton>
                        </Box>

                        {visible && (
                            <div>
                                <CssBaseline />
                                <TextField
                                    sx={{ mt: -2, width: 110 }}
                                    required
                                    margin="dense"
                                    name="nickNameChange"
                                    variant="standard"
                                    type="text"
                                    id="nickNameChange"
                                    label="닉네임 변경"
                                    placeholder="변경할 닉네임은?"
                                    onChange={onChangeNicknameHandler}
                                />
                                <IconButton aria-label="done" onClick={changeNickname}>
                                    <DoneOutlineIcon style={{ fontSize: 20 }} />
                                </IconButton>
                            </div>
                        )}
                    </Box>
                </div>
            </Box>
        </>
    )
}
