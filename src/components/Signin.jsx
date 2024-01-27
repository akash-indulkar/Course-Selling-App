import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import { Card, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    return <div>
        <div style={{
            paddingTop: 150,
            marginBottom: 10,
            display: "flex",
            justifyContent: "center"
        }}>
            <Typography variant={"h6"}>
                Welcome to Course Selling App. Sign in below
            </Typography>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Card varint={"outlined"} style={{ width: 400, padding: 20 }}>
                <TextField
                    onChange={(evant11) => {
                        let elemt = evant11.target;
                        setEmail(elemt.value);
                    }}
                    fullWidth={true}
                    label="Email"
                    variant="outlined"
                />
                <br /><br />
                <TextField
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    fullWidth={true}
                    label="Password"
                    variant="outlined"
                    type={"password"}
                />
                <br /><br />

                <Button
                    size={"large"}
                    variant="contained"
                    onClick={async () => {
                        try {
                            const res = await axios.post("http://localhost:3000/admin/login", JSON.stringify({
                                username: email,
                                password: password
                            }), {
                                headers: {
                                    "Content-type": "application/json"
                                }
                            });
                            window.alert(res.data.message);
                            localStorage.setItem("token", res.data.token);
                            navigate("/courses")
                        } catch (e) {
                            window.alert(e.response.data.message)
                        }
                    }}

                > Signin</Button>
            </Card>
        </div>
    </div>
}

export default Signin;