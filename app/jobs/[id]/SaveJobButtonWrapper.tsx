'use client';

import SaveJobButton from '../../../components/SaveJobButton';

export default function SaveJobButtonWrapper({ jobId }: { jobId: string }) {
    return <SaveJobButton jobId={jobId} variant="button" />;
}
