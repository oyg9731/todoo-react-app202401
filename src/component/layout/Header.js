import React, {useEffect, useState} from 'react';
import {
  AppBar, Toolbar, Grid,
  Typography, Button
} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import './Header.css';

import anonymous from '../../assets/img/anonymous.jpg';

import {isLogin, getCurrentLoginUser} from "../../util/login-util";
import {AUTH_URL} from "../../config/host-config";

const Header = () => {

  const redirection = useNavigate();

  // 로그인 상태를 나타내는 변수
  const [isLoggedIn, setIsLoggedIn] = useState(isLogin());

  // 이미지 URL을 저장할 상태변수
  const [imgUrl, setImgUrl] = useState(null);


  const logoutHandler = e => {
    localStorage.clear();
    setImgUrl(null);
    redirection('/login');
  };

  // 로그인 상태를 지속적으로 감지하기 위해 useEffect 사용
  useEffect(() => {
    setIsLoggedIn(isLogin());
  }, [isLogin()]);


  // 서버에 프로필사진 요청
  const fetchProfileImage = async () => {

    const url = AUTH_URL + "/load-profile";
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + getCurrentLoginUser().token
      }
    });

    if (res.status === 200) {
      const profileData = await res.blob();

      // blob이미지를 url로 변환
      const imgUrl = window.URL.createObjectURL(profileData);

      setImgUrl(imgUrl);
    } else {
      const errMsg = await res.text();
      alert(errMsg);
      setImgUrl(null);
    }

  };

  // 프로필 사진 렌더링 처리
  useEffect(() => {
    isLoggedIn && fetchProfileImage();
  }, [isLoggedIn]);

  return (
      <AppBar position="fixed" style={{
        background: '#38d9a9',
        width: '100%'
      }}>
        <Toolbar>
          <Grid justify="space-between" container>
            <Grid item flex={9}>
              <div style={
                {
                  display: 'flex',
                  alignItems: 'center'
                }
              }>
                <Typography variant="h4">
                  <Link to='/'>
                    {
                      isLogin()
                          ? getCurrentLoginUser().username + '님'
                          : '오늘'
                    }
                    의 할일
                  </Link>
                </Typography>

                <img
                    src={imgUrl || anonymous}
                    alt='프로필 사진'
                    style={{
                      marginLeft: 20,
                      width: 30,
                      height: 30,
                      borderRadius: '50%'
                    }}
                />

              </div>
            </Grid>

            <Grid item>
              <div className='btn-group'>
                {
                  isLogin()
                      ?
                      (
                          <button
                              className='logout-btn'
                              onClick={logoutHandler}>로그아웃</button>
                      )
                      :
                      (
                          <>
                            <Link to='/login'>로그인</Link>
                            <Link to='/join'>회원가입</Link>
                          </>
                      )
                }
              </div>
            </Grid>

          </Grid>
        </Toolbar>
      </AppBar>
  );
};

export default Header;