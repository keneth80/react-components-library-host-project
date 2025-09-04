import React from 'react';
import loadable from '@loadable/component';
import { ErrorBoundary } from "react-error-boundary";
import { FeButton } from 'react-components-library-seed';

interface FallbackProps {
    error?: Error;
    resetError?: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
    return (
      <div role="alert">
        ⚠ Something went wrong loading remote.
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  }


// 개발 모드에서는 모듈 페더레이션으로 컴포넌트를 가져옵니다.
const RemoteButton = loadable(() => import('designSystem/Button'), {
    fallback: <div>Loading remote components...</div>
});
const RemoteCard = loadable(() => import('designSystem/Card'), {
    fallback: <div>Loading remote components...</div>
});
// const RemoteFeButton = lazy(() => import('zds/FeButton'));
const RemoteFeButton = loadable(() => import('zds/FeButton'), {
    fallback: <div>Loading...</div>
});
// const RemoteFeButton = lazy(() => import('zds/FeButton1').then((result) => {
//     console.log('result : ', result);
//     return result
// }).catch(() => {
//     return <div>⚠ Remote container missing</div>
// }).finally(() => {
//     console.log('finally : ');
// }));
// const RemoteFeButton = lazy(() => loadRemoteModule('zds', './FeButton'));


const App: React.FC = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>템플릿 프로젝트</h1>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                {/* Module Federation으로 로드된 컴포넌트 */}
                <div style={{ padding: '1rem', border: '2px solid #3b82f6', borderRadius: '0.5rem' }}>
                    <h2>Module Federation</h2>
                    <RemoteButton onClick={() => alert('디자인 시스템 원격 버튼이 클릭되었습니다!')}>원격 버튼</RemoteButton>
                    <RemoteCard title='원격 카드'>이 카드는 런타임에 동적으로 로드됩니다.</RemoteCard>
                </div>

                <div style={{ padding: '1rem', border: '2px solid #3b82f6', borderRadius: '0.5rem' }}>
                    <h2>ZDS Module Federation</h2>
                    <ErrorBoundary
                        FallbackComponent={ErrorFallback}
                        onReset={() => {
                        // 필요시 리셋 로직
                        console.log("Remote module reload attempt");
                        }}
                    >
                        <RemoteFeButton primary={true} label="ZDS 버튼" />
                    </ErrorBoundary>
                </div>

                {/* npm 패키지로 로드된 컴포넌트 */}
                <div style={{ padding: '1rem', border: '2px solid #ef4444', borderRadius: '0.5rem' }}>
                    <h2>NPM 패키지</h2>
                    <FeButton primary={true} label='ZDS NPM 버튼' onClick={() => alert('디자인 시스템 로컬 버튼이 클릭되었습니다!')}></FeButton>
                </div>
            </div>
        </div>
    );
};

export default App;
