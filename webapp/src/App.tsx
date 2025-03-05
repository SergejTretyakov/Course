import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TrpcProvider } from './lib/trpc';
import { AllGalleryPage } from './pages/pins/AllGalleryPage/index.tsx';
import { ViewPinPage } from './pages/pins/ViewPinPage/index.tsx';
import * as routes from './lib/routes.ts';
import { Layout } from './components/Layout/index.tsx';
import './styles/global.scss';
import { CreatePinPage } from './pages/pins/CreatePinPage/index.tsx';
import { SignUpPage } from './pages/auth/SignUpPage/index.tsx';
import { SignInPage } from './pages/auth/SignInPage/index.tsx';
import { SignOutPage } from './pages/auth/SignOutPage/index.tsx';
import { UpdatePinPage } from './pages/pins/EditPinPage/index.tsx';
import { AppContextProvider } from './lib/ctx.tsx';
import { NotFoundPage } from './pages/other/NotFoundPage/index.tsx';
import { UpdateProfilePage } from './pages/auth/UpdateProfilePage/index.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { NotAuthRouteTracker } from './components/NonAuthRoute/index.tsx';

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter>
          <NotAuthRouteTracker />
            <Routes>
            <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getUpdateProfileRoute.definition} element={<UpdateProfilePage />} />
                <Route path={routes.getAllGalleryRoute.definition} element={<AllGalleryPage />} />
                <Route path={routes.getViewPinRoute.definition} element={<ViewPinPage />} />
                <Route path={routes.getUpdateProfileRoute.definition} element={<UpdatePinPage />} />
                <Route path={routes.getCreatePinRoute.definition} element={<CreatePinPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  );
};
