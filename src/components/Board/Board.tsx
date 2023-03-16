import React from 'react';
import "./Board.css";
import { Toolbar } from '@mui/material';
import Box from '@mui/material/Box';


const availableColors = ["green", "red", "yellow", "blue", "pink", "skyblue", "black"];

function Board() {

    const renderCircle = (bgColor?: string) => {
        return (
            <button className="circle" style={{backgroundColor: bgColor ? bgColor : undefined}}></button>
        )
    };

    const generateNumbersArray = (length: number) => {
        return Array.from({ length: length }, (_, index) => index + 1);
    };

    return (
        <>
            <Toolbar />
            <Box
                sx={{
                    width: '40%',
                    height: '90vh',
                    backgroundColor: 'darkgray',
                    margin: 'auto'
                }}
            >
                {/* Available Colors */}
                <Box>
                    {
                        availableColors.map((color: string) => {
                            return (
                                renderCircle(color)
                            )
                        })
                    }
                </Box>
                {/* Board to place the colors */}
                <Box>
                    {
                        generateNumbersArray(10).map(() => {
                            return (
                                <div>
                                    {
                                        generateNumbersArray(4).map(() => {
                                            return (
                                                renderCircle()
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </Box>
            </Box>
        </>
    );
}

export default Board;
