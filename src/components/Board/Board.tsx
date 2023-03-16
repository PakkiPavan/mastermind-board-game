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
                <Box
                    sx={{
                        borderBottom: '2px solid black',
                        marginBottom: '5px'
                    }}
                >
                    {
                        availableColors.map((color: string, index: number) => {
                            return (
                                <React.Fragment key={index}>
                                    {renderCircle(color)}
                                </React.Fragment>
                            )
                        })
                    }
                </Box>
                {/* Board to place the colors */}
                <Box>
                    {
                        generateNumbersArray(10).map((_, index: number) => {
                            return (
                                <div key={index}>
                                    {
                                        generateNumbersArray(4).map((_, index:number) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    {renderCircle()}
                                                </React.Fragment>
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
