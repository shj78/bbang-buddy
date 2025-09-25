import { Modal, TextField, Button, Box } from "@mui/material";
import { useQuestion } from "../../hooks/useQuestion";

function Question({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { formData, updateFormData, handleSubmit, resetForm, isPending } =
        useQuestion(() => {
            onClose();
        });

    // 모달 닫기 버튼 버튼 클릭 시 호출되는 함수
    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    height: 455,
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 24,
                    outline: "none",
                }}
            >
                <h3
                    style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginBottom: 35,
                    }}
                >
                    문의하기
                </h3>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        fontSize: "10px",
                    }}
                >
                    <TextField
                        label="제목"
                        value={formData.title}
                        onChange={(e) =>
                            updateFormData("title", e.target.value)
                        }
                        sx={{ width: "100%", height: "40px" }}
                    />
                    <TextField
                        label="내용"
                        multiline
                        rows={8}
                        value={formData.description}
                        onChange={(e) =>
                            updateFormData("description", e.target.value)
                        }
                        sx={{ width: "100%" }}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isPending}
                        sx={{ width: "80px", height: "40px" }}
                    >
                        {isPending ? "전송중..." : "보내기"}
                    </Button>
                </Box>
            </div>
        </Modal>
    );
}

export default Question;
