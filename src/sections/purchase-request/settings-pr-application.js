import { Card, CardContent, CardHeader, Divider, Grid } from "@mui/material"


export const SettingsPRApplication = (props)=>{
    const {
        locations,
    }=props;

    return (
        <form onSubmit={}>
            <Card>
                <CardHeader title="Common Info"/>
                <Divider/>
                <CardContent>
                    <Grid container wrap="wrap">

                    </Grid>
                </CardContent>
            </Card>
        </form>
    )
}