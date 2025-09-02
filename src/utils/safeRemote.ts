// safeRemote.tsx
import React from "react";

declare const __webpack_share_scopes__: { default: Record<string, unknown> };

function waitForContainer(scope: string, maxRetries = 20, interval = 100): Promise<any> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      const container = (window as any)[scope];      
      if (container) {
        resolve(container);
      } else {
        attempts++;
        if (attempts > maxRetries) {
          reject(new Error(`Container ${scope} not found`));
        } else {
          setTimeout(check, interval);
        }
      }
    };
    check();
  });
}

export async function loadRemoteModule(scope: string, module: string) {
  let container: any;
  try {
    container = await waitForContainer(scope); // container ready
    console.log('container : ', container);
  } catch {
    return { default: () => '<div>⚠ Remote container missing</div>' };
  }
  console.log('container : ', container);
  if (!container.get || !container.get(module)) {
    return { default: () => '<div>⚠ Component unavailable</div>' };
  }

  try {
    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(module);
    const Module = await factory();

    // ✅ 반드시 { default: Component } 형태로 반환
    return { default: Module.default || Module };
  } catch (e) {
    console.warn(`⚠ Failed to load module ${module}`, e);
    return { default: () => '<div>⚠ Failed to load component</div>' };
  }
}
