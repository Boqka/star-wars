import { Layout, Pagination, Input } from 'antd';
import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

export function PageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('search'));

  const onChange = (page, pageSize) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
  };

  const onSearch = (value) => {
    if (!value) {
      setSearchParams();
      setFilter();
    } else {
      setSearchParams({
        search: value,
      });
      setFilter(value);
    }
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData', currentPage, currentPageSize],
    keepPreviousData: true,
    queryFn: () => fetch(`https://catfact.ninja/facts?page=${currentPage}&limit=${currentPageSize}`).then((res) => res.json()),
  });

  const filteredData = useMemo(() => data?.data.filter((el) => {
    if (!filter) {
      return el;
    }
    return el.fact?.toLowerCase().includes(filter);
  }), [filter, data]);

  if (error) return `An error has occurred: ${error.message}`;

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Search
          placeholder="Search"
          allowClear
          defaultValue={filter}
          onSearch={onSearch}
          style={{
            width: 200,
          }}

        />
      </Header>
      <Content
        style={{
          padding: '0 50px',
        }}
      >
        <div className="site-layout-content">
          {
            isLoading
              ? 'Loading...'
              : filteredData.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={item.length + index} className="cats-item">
                  <div>
                    {item.fact}
                  </div>
                  <div>
                    {item.length}
                  </div>
                </div>
              ))
          }
          <Pagination
            current={currentPage}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            onChange={onChange}
            total={data?.total}
          />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export default PageContent;
