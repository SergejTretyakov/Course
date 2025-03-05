import { getViewPinRoute } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';
import { Link } from 'react-router-dom';
import css from './index.module.scss';
import Masonry from 'react-masonry-css';
import { Alert } from '../../../components/Alert';
import InfiniteScroll from 'react-infinite-scroller';
import { layoutContentElRef } from '../../../components/Layout';
import { Loader } from '../../../components/Loader';
import { withPageWrapper } from '../../../lib/pageWrapper';

export const AllGalleryPage: React.FC = withPageWrapper({
  title: 'Галерея',
})(() => {
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isRefetching } =
    trpc.getGallery.useInfiniteQuery(
      {
        limit: 3,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor;
        },
      }
    );

  if (!data) {
    return <span>No data</span>;
  }
  // Настройка Masonry
  const breakpointColumnsObj = {
    default: 6, // Количество колонок по умолчанию
    1200: 4, // Количество колонок при ширине экрана 1100px
    700: 2, // Количество колонок при ширине экрана 700px
    500: 1, // Количество колонок при ширине экрана 500px
  };

  return (
    <>
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : (
        <InfiniteScroll
          threshold={250}
          loadMore={() => {
            void fetchNextPage();
          }}
          hasMore={hasNextPage}
          loader={
            <div className={css.more} key="loader">
              <Loader type="section" />
            </div>
          }
          getScrollParent={() => layoutContentElRef.current}
          useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
        >
          <Masonry breakpointCols={breakpointColumnsObj} className={css.gallery} columnClassName={css.masonryColumn}>
            {data.pages
              .flatMap((page) => page.gallery)
              .map((elem) => (
                <div className={css.pin} key={elem.id}>
                  <button className={css.save} onClick={() => console.log('!')}>
                    Сохранить
                  </button>
                  <Link to={getViewPinRoute({ pinID: elem.id })}>
                    <img className={css.image} src={elem.image} alt="pin image" />
                  </Link>
                </div>
              ))}
          </Masonry>
        </InfiniteScroll>
      )}
    </>
  );
});
