import { lazy } from 'react'
import { RoutePath, Routes } from './types'

// eslint-disable-next-line import/no-anonymous-default-export

// const publicRoutes: Routes[] = [
//   {
//     path: RoutePath.HOME_PAGE,
//     name: 'Головна',
//     exact: true,
//     element: lazy(() => import('../pages/HomePage/index' /* webpackChunkName: "Home Page" */)),
//   },
//   {
//     path: RoutePath.ABOUT_PAGE,
//     name: 'Про нас',
//     exact: true,
//     element: lazy(() => import('../pages/AboutPage/index' /* webpackChunkName: "About Page" */)),
//   },

//   {
//     name: 'Як зробити замовлення',
//     path: RoutePath.HOW_TO,
//     exact: true,
//     element: lazy(() => import('../pages/HowToPage/index' /* webpackChunkName: "HowTo Page" */)),
//   },
//   {
//     name: 'Доставка і оплата',
//     path: RoutePath.DELIVERY,
//     exact: true,
//     element: lazy(() => import('../pages/PaymentPage/index' /* webpackChunkName: "Payment Page" */)),
//   },
//   {
//     name: 'Контакти',
//     path: RoutePath.CONTACTS,
//     exact: true,
//     element: lazy(() => import('../pages/ContactsPage/index' /* webpackChunkName: "Contacts" */)),
//   },
//   {
//     name: 'Наша місія',
//     path: RoutePath.MISSION,
//     exact: true,
//     element: lazy(() => import('../pages/MissiyaPage/index' /* webpackChunkName: "Missiya Page" */)),
//   },
//   {
//     name: 'Наші партнери',
//     path: RoutePath.PARTNERS,
//     exact: true,
//     element: lazy(() => import('../pages/PartnersPage/index' /* webpackChunkName: "Partners Page" */)),
//   },
//   {
//     name: 'Наша команда',
//     path: RoutePath.TEAM,
//     exact: true,
//     element: lazy(() => import('../pages/TeamPage/index' /* webpackChunkName: "Team Page" */)),
//   },
//   {
//     name: 'Медичні експерти',
//     path: RoutePath.EXPERTS,
//     exact: true,
//     element: lazy(() => import('../pages/MedicalExpertsPage/index' /* webpackChunkName: "Medical Experts Page" */)),
//   },

//   {
//     name: 'Редакційна політика',
//     path: RoutePath.EDITOR_POLICY,
//     exact: true,
//     element: lazy(() => import('../pages/EditorialPolicyPage/index' /* webpackChunkName: "Editorial Policy Page" */)),
//   },
//   {
//     name: 'Маркетингова політика',
//     path: RoutePath.MARKETING_POLICY,
//     exact: true,
//     element: lazy(() => import('../pages/MarketingPolicyPage/index' /* webpackChunkName: "Marketing Policy Page" */)),
//   },
//   {
//     name: 'Політика конфіденційності',
//     path: RoutePath.TERMS,
//     exact: true,
//     element: lazy(() => import('../pages/TermsPage/index' /* webpackChunkName: "Terms Page" */)),
//   },
//   {
//     name: 'Угода про використання',
//     path: RoutePath.AGREEMENT,
//     exact: true,
//     element: lazy(() => import('../pages/AgreementPage/index' /* webpackChunkName: "Agreement Page" */)),
//   },

//   {
//     name: 'Умови повернення',
//     path: RoutePath.ORDER_RETURN,
//     exact: true,
//     element: lazy(() => import('../pages/OrderReturnPage/index' /* webpackChunkName: "Order Return Page" */)),
//   },
//   {
//     name: 'Гарантії якості',
//     path: RoutePath.WARRANTY,
//     exact: true,
//     element: lazy(() => import('../pages/WarrantyPage/index' /* webpackChunkName: "Warranty Page" */)),
//   },
//   {
//     path: `${RoutePath.DRUGS}/medikamenti`,
//     name: 'Медикаменти',
//     exact: true,
//     element: lazy(() => import('../pages/MedicinesPage/index' /* webpackChunkName: "Drug List Page" */)),
//   },
//   {
//     path: `${RoutePath.DRUGS}/:first_level/*`,
//     name: '',
//     exact: true,
//     element: lazy(() => import('../pages/CategoryPage/index' /* webpackChunkName: "Drug List Page" */)),
//   },
//   {
//     path: `${RoutePath.PRODUCT}/:id`,
//     name: '',
//     exact: true,
//     element: lazy(() => import('../pages/ProductPage/index' /* webpackChunkName: "Drug List Page" */)),
//   },
// ]
// const privateRoutes: Routes[] = [
//   {
//     path: RoutePath.PERSONAL_INFO,
//     name: 'Персональні дані',
//     exact: true,
//     element: lazy(() => import('../pages/PersonalInfoPage/index' /* webpackChunkName: "PersonalInfo Page" */)),
//   },
//   {
//     path: RoutePath.WISHLIST,
//     name: 'Список бажань',
//     exact: true,
//     element: lazy(() => import('../pages/WishListPage/index' /* webpackChunkName: "WishListPage Page" */)),
//   },
//   {
//     path: RoutePath.ORDERS,
//     name: 'Мої замовлення',
//     exact: true,
//     element: lazy(() => import('../pages/OrderedPage/index' /* webpackChunkName: "Ordered Page" */)),
//   },
//   {
//     path: RoutePath.CHECKOUT,
//     name: 'Оформлення',
//     exact: true,
//     element: lazy(() => import('../pages/CheckoutPage/index' /* webpackChunkName: "Checkout Page" */)),
//   },
//   {
//     path: RoutePath.CHECKOUT_SUCCESS,
//     name: 'Оформлення',
//     exact: true,
//     element: lazy(() => import('../pages/CheckoutSuccessPage/index' /* webpackChunkName: "Checkout Success Page" */)),
//   },
// ]
const adminRoutes: Routes[] = [
  {
    path: RoutePath.ADMIN,
    name: 'Адмін',
    exact: true,
    element: lazy(() => import('../pages/AdminPage/index' /* webpackChunkName: "Admin Page" */)),
  },
  {
    path: RoutePath.LOGIN,
    name: 'Логіг',
    exact: true,
    element: lazy(() => import('../pages/LoginPage/LoginPage' /* webpackChunkName: "Admin Page" */)),
  },
]
export { adminRoutes }
