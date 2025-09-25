export const sortSelectStyles = {
    backgroundColor: "transparent",
    color: "black",
    fontSize: "14px",
    fontWeight: 400,
    "& .MuiSelect-select": {
        padding: "4px 24px 4px 0",
        backgroundColor: "transparent",
        color: "black",
    },
    "& .MuiInput-root": {
        "&:before": {
            borderBottom: "none",
        },
        "&:after": {
            borderBottom: "none",
        },
        "&:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
        },
    },
    "& .MuiSelect-icon": {
        color: "black",
    },
};

export const sortSelectMenuProps = {
    PaperProps: {
        sx: {
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "& .MuiMenuItem-root": {
                fontSize: "14px",
                fontWeight: 400,
                color: "black",
                backgroundColor: "transparent",
                "&:hover": {
                    backgroundColor: "#f5f5f5",
                },
                "&.Mui-selected": {
                    backgroundColor: "transparent",
                    "&:hover": {
                        backgroundColor: "#f5f5f5",
                    },
                },
            },
        },
    },
};
