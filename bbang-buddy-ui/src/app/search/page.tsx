import SearchClient from "../../components/client/SearchClient";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Suspense } from "react";

export default function SearchPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SearchClient />
        </Suspense>
    );
}
