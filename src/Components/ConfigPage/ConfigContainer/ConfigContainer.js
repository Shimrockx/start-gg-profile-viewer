import React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "./ConfigContainer.css";

export default class ConfigContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            player: this.props.player,
        };
    }

    onSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        if (data.get("slug") && data.get("gamerTag")) {
            this.setState((prevState) => {
                let player = prevState.player;
                player = {
                    slug: data.get("slug"),
                    gamerTag: data.get("gamerTag"),
                };
                this.props.saveConfig(player);
                return {
                    player,
                };
            });
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    componentDidMount() {}

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Configuration
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
                            id="slug"
                            label="Slug (found it next to your gamertag on start.gg)"
                            name="slug"
                            autoFocus
                            color="action"
                            variant="standard"
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="gamerTag"
                            label="Gamertag (no team name)"
                            type="text"
                            id="gamerTag"
                            color="action"
                            variant="standard"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            color="action"
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
    }
}
