import TroubleShootDevicesModal from "./components/TroubleShootDevicesModal";
import backgroundImage from "../../assets/pre-depo/bg.png";

const TroubleShootDevices = () => (
    <div
        style={{
            height: "100vh",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
        }}
    >
        <TroubleShootDevicesModal />
    </div>
);
export default TroubleShootDevices;
