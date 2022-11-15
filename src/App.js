import {Layout} from 'antd';
import React, {useState} from 'react';
import {Pagination} from 'antd';
import './App.css';
import {useQuery} from "@tanstack/react-query";

const {Header, Content, Footer} = Layout;

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const onChange = (page, pageSize) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
  };

  const {isLoading, error, data} = useQuery({
    queryKey: ['repoData', currentPage, currentPageSize],
    keepPreviousData : true,
    queryFn: () =>
      fetch(`https://catfact.ninja/facts?page=${currentPage}&limit=${currentPageSize}`).then(res =>
        res.json()
      )
  })

  if (error) return 'An error has occurred: ' + error.message

  return (
    <Layout className="layout">
      <Header>
        <div className="logo"/>
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
              : data.data.map((item, index) => {
                return (
                  <div key={index} className="cats-item">
                    <div>
                      {item.fact}
                    </div>
                    <div>
                      {item.length}
                    </div>
                  </div>
                )
              })}
          <Pagination current={currentPage} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                      onChange={onChange} total={data?.total} />
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
  )
};
export default App;
