import useLocationStore from "../../store/useLocationStore";
import { PREDEFINED_LOCATIONS } from "../../constants/location";

export default function ManualLocationButton() {
    const { isManualLocationMode, setManualLocationMode, setManualLocation } =
        useLocationStore();

    // 미리 정의된 위치들
    const predefinedLocations = PREDEFINED_LOCATIONS;

    //useCallback 적용후 성능이 더 안좋아짐
    const moveToLocation = (location: {
        name: string;
        lat: number;
        lng: number;
    }) => {
        setManualLocation({ latitude: location.lat, longitude: location.lng });
    };

    return (
        <div>
            {/* 위치 제어 버튼들 - 지도 위에 오버레이 */}
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                {/* 수동 위치 지정 버튼 */}
                <button
                    onClick={() => setManualLocationMode(!isManualLocationMode)}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: isManualLocationMode
                            ? "#F6F6F6"
                            : "#F6F6F6",
                        color: isManualLocationMode ? "#333" : "#333",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(0,0,0,0.2)";
                    }}
                >
                    {isManualLocationMode ? "취소" : "위치 직접 선택"}
                </button>

                {/* 미리 정의된 위치 버튼들 - 드롭다운 스타일 */}
                {isManualLocationMode && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            padding: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            border: "1px solid #ddd",
                            animation: "slideDown 0.2s ease-out",
                        }}
                    >
                        {predefinedLocations.map((location, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    moveToLocation(location);
                                    setManualLocationMode(false); // 위치 선택 후 드롭다운 닫기
                                }}
                                style={{
                                    padding: "8px 12px",
                                    backgroundColor: "transparent",
                                    color: "#333",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    transition: "all 0.2s ease",
                                    textAlign: "left",
                                    width: "100%",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "#f5f5f5";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "transparent";
                                }}
                            >
                                {location.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
