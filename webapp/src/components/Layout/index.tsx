import { Link, Outlet } from 'react-router-dom';
import {
  getAllGalleryRoute,
  getCreatePinRoute,
  getSignUpRoute,
  getSignInRoute,
  getSignOutRoute,
  getUpdateProfileRoute,
} from '../../lib/routes';
import css from './index.module.scss';
import { useMe } from '../../lib/ctx';
import { createRef } from 'react';

export const layoutContentElRef = createRef<HTMLDivElement>();

export const Layout = () => {
  const me = useMe();
  return (
    <div className={css.layout}>
      <div className={css.navigation}>
        <div className={css.logo}>Gallery</div>
        <ul className={css.menu}>
          <li className="css.item">
            <Link to={getAllGalleryRoute()} className={css.link}>
              Галлерея
            </Link>
          </li>
          {me ? (
            <>
              <li className="css.item">
                <Link to={getCreatePinRoute()} className={css.link}>
                  Создать пин
                </Link>
              </li>
              <li className="css.item">
                <Link to={getUpdateProfileRoute()} className={css.link}>
                  Редактирование профиля
                </Link>
              </li>
              <li className={css.item}>
                <Link className={css.link} to={getSignOutRoute()}>
                  Выйти ({me.nick})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="css.item">
                <Link to={getSignUpRoute()} className={css.link}>
                  Зарегистрироваться
                </Link>
              </li>
              <li className="css.item">
                <Link to={getSignInRoute()} className={css.link}>
                  Войти
                </Link>
              </li>
            </>
          )}
        </ul>
        <hr />
      </div>
      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  );
};
