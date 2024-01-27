import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button } from '@mui/material';
import { useEffect, useState } from "react";
import axios from 'axios';

function Landing() {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/admin/me", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setUserEmail(res.data.username)
        });
    }, []);

    if (!userEmail) {
        return <div>
            <Grid container style={{ padding: "5vw" }}>
                <Grid item xs={12} md={6} lg={6}>
                    <div style={{ marginTop: 100 }}>
                        <Typography variant={"h2"}>
                            Admin Dashboard
                        </Typography>
                        <Typography variant={"h5"}>
                            A place to learn, earn and grow
                        </Typography>
                        <div style={{ display: "flex", marginTop: 20 }}>
                            <div style={{ marginRight: 10 }}>
                                <Button
                                    size={"large"}
                                    variant={"contained"}
                                    onClick={() => {
                                        navigate("/signup")
                                    }}
                                >Signup</Button>
                            </div>
                            <div>
                                <Button
                                    size={"large"}
                                    variant={"contained"}
                                    onClick={() => {
                                        navigate("/signin")
                                    }}
                                >Signin</Button>
                            </div>
                        </div>
                    </div>
                    <div>
                    </div>
                </Grid>
                <Grid item xs={12} md={6} lg={6} style={{ marginTop: 20 }}>
                    <img src={"https://classplusapp.com/growth/wp-content/uploads/2022/06/How-to-sell-courses-through-social-media-1-1024x571.jpg"} width={"100%"} />
                </Grid>
            </Grid>
        </div>
    } else {
        navigate("/courses")
    }

}

export default Landing;