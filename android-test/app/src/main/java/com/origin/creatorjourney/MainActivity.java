package com.origin.creatorjourney;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * ORIGIN V10 Android evaluation build.
 *
 * Loads the verified Cloudflare V10 journey app. No HTML/CSS/JS is modified.
 * The web experience needs network connectivity; this is not the final offline/native release.
 */
public class MainActivity extends Activity {
    private static final String APP_URL =
            "https://origin-creator-journey.rayadinaveen98.workers.dev/v10/";
    private static final String APP_HOST =
            "origin-creator-journey.rayadinaveen98.workers.dev";

    private FrameLayout root;
    private WebView webView;
    private LinearLayout errorOverlay;
    private boolean mainPageError = false;

    private int dp(float value) {
        return (int) (getResources().getDisplayMetrics().density * value + 0.5f);
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(8, 13, 12));
        getWindow().setNavigationBarColor(Color.rgb(8, 13, 12));

        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(8, 13, 12));
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(8, 13, 12));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);  // Required for V10's cinematic interactions.
        settings.setDomStorageEnabled(true);   // Required for Continue Journey and My List.
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSafeBrowsingEnabled(true);
        settings.setDefaultTextEncodingName("UTF-8");

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) return false;
                return handleExternalUrl(request.getUrl());
            }

            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                mainPageError = false;
                if (errorOverlay != null) errorOverlay.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    mainPageError = true;
                    showConnectionError();
                }
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request,
                                            WebResourceResponse errorResponse) {
                if (request.isForMainFrame() && errorResponse.getStatusCode() >= 400) {
                    mainPageError = true;
                    showConnectionError();
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (!mainPageError && errorOverlay != null) {
                    errorOverlay.setVisibility(View.GONE);
                }
            }
        });

        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        errorOverlay = makeErrorOverlay();
        root.addView(errorOverlay, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        errorOverlay.setVisibility(View.GONE);

        setContentView(root);

        if (state != null && webView.restoreState(state) != null) {
            // WebView restores its page and navigation history after process recreation.
        } else {
            webView.loadUrl(APP_URL);
        }
    }

    private boolean handleExternalUrl(Uri uri) {
        if ("https".equalsIgnoreCase(uri.getScheme())
                && APP_HOST.equalsIgnoreCase(uri.getHost())) {
            return false; // Stay inside ORIGIN for Home, Life Journey and Studio.
        }

        if (!"http".equalsIgnoreCase(uri.getScheme())
                && !"https".equalsIgnoreCase(uri.getScheme())) {
            return true; // Never pass arbitrary custom URI schemes to Android.
        }
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            intent.addCategory(Intent.CATEGORY_BROWSABLE);
            startActivity(intent); // Historical sources and CC attribution in regular browser.
        } catch (ActivityNotFoundException ignored) {
            // The user may not have a browser available.
        }
        return true;
    }

    private LinearLayout makeErrorOverlay() {
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setGravity(Gravity.CENTER);
        panel.setPadding(dp(28), dp(20), dp(28), dp(20));
        panel.setBackgroundColor(Color.rgb(8, 13, 12));

        TextView mark = new TextView(this);
        mark.setText("ORIGIN.");
        mark.setTextColor(Color.rgb(232, 189, 131));
        mark.setTextSize(38);
        mark.setTypeface(Typeface.SERIF, Typeface.BOLD);
        mark.setGravity(Gravity.CENTER);
        panel.addView(mark);

        TextView message = new TextView(this);
        message.setText("We couldn't load ORIGIN.\nCheck your connection and try again.");
        message.setTextColor(Color.rgb(245, 239, 228));
        message.setTextSize(15);
        message.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        textParams.topMargin = dp(22);
        textParams.bottomMargin = dp(22);
        panel.addView(message, textParams);

        Button retry = new Button(this);
        retry.setAllCaps(false);
        retry.setText("Try again");
        retry.setOnClickListener(v -> {
            mainPageError = false;
            errorOverlay.setVisibility(View.GONE);
            webView.loadUrl(APP_URL);
        });
        panel.addView(retry);
        return panel;
    }

    private void showConnectionError() {
        if (errorOverlay != null) errorOverlay.setVisibility(View.VISIBLE);
    }

    @Override
    public void onBackPressed() {
        if (errorOverlay != null && errorOverlay.getVisibility() == View.VISIBLE) {
            errorOverlay.setVisibility(View.GONE);
            webView.loadUrl(APP_URL);
        } else if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            root.removeView(webView);
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
