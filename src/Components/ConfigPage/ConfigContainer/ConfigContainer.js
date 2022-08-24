import React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "./ConfigContainer.css";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
let theme = createTheme({
    palette: {
        mode: "light",
    },
});

export default class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            player: this.props.player,
        };

        theme = createTheme({
            palette: {
                mode: this.props.theme == "dark" ? "dark" : "light",
            },
        });
    }

    onSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        if (data.get("token")) {
            this.state.player = {
                token: data.get("token"),
            };
            this.props.saveConfig(this.state.player);
        }
    }

    componentDidMount() {}

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography component="h1" variant="h4">
                            Configuration
                        </Typography>
                        <Typography mt={2}>
                            Here's a link to the official page of start.gg on
                            how to get your token :{" "}
                            <Link href="https://developer.smash.gg/docs/authentication/">
                                Generating a Token
                            </Link>
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={(e) => this.onSubmit(e)}
                            noValidate
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="token"
                                label="Token"
                                name="token"
                                autoFocus
                                variant="standard"
                                placeholder={this.state.player.token}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        );
    }
}
