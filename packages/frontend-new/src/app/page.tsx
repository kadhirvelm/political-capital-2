import { PoliticalCapitalTwo } from "./components/PoliticalCapitalTwo";
import PoliticalCapitalProviders from "./providers";

export default function Home() {
    return (
        <PoliticalCapitalProviders>
            <PoliticalCapitalTwo />
        </PoliticalCapitalProviders>
    );
}
