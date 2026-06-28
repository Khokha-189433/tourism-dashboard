import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../../../../api/refreshToken"
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";

export default function EditTrip() {

    
    const navigate = useNavigate();

    const { tripId } = useParams();
    console.log(tripId)
    const [price, setPrice] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    
  

    useEffect(() => {
       const fetchTrip = async () => {
        try {
            const response = await api.get(`/trips/${tripId}`);

            setPrice(response.data.data.price);
            setIsFeatured(response.data.data.is_featured);

        } catch (err) {
            console.log(err);
        }
    };
     fetchTrip()
    }, []);

   

    const updateTrip = async () => {
        try {

            await api.put(`/trips/${tripId}`, {
                price: Number(price),
                is_featured: isFeatured,
            });

            alert("تم تعديل الرحلة بنجاح");

            navigate("/Trips");

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <TextField
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={isFeatured}
                        onChange={(e) =>
                            setIsFeatured(e.target.checked)
                        }
                    />
                }
                label="Featured"
            />

            <Button
                variant="contained"
                onClick={updateTrip}
            >
                Save
            </Button>
        </>
    );
}